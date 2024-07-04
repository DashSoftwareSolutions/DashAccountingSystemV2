using System.Linq.Expressions;
using System.Reflection;

namespace DashAccountingSystemV2.Extensions
{
    public static class ObjectExtensions
    {
        /// <summary>
        /// Smart clone
        /// </summary>
        /// <typeparam name="TResult">Type of result object</typeparam>
        /// <param name="obj">Soure object</param>
        /// <returns>Cloned object cast to TResult</returns>
        public static TResult Clone<TResult>(this object obj) where TResult : class, new()
        {
            if (obj == null)
                throw new ArgumentNullException(nameof(obj));

            var type = obj.GetType();

            var openGeneric = typeof(ObjectExtCache<,>);
            var closedGeneric = openGeneric.MakeGenericType(type, type);
            var method = closedGeneric.GetMethod("Clone", BindingFlags.Static | BindingFlags.Public | BindingFlags.InvokeMethod);

            return method.Invoke(null, new object[] { obj }) as TResult;
        }

        public static TResult Clone<TSrc, TResult>(this TSrc obj) where TResult : TSrc, new()
        {
            return ObjectExtCache<TSrc, TResult>.Clone(obj);
        }

        static class ObjectExtCache<TSrc, TResult> where TResult : TSrc, new()
        {
            private static readonly Func<TSrc, TResult> cloner;

            static ObjectExtCache()
            {
                ParameterExpression param = Expression.Parameter(typeof(TSrc), "in");

                var bindings = typeof(TSrc).GetProperties()
                    .Where(p => p.CanRead && p.CanWrite)
                    .Select(p => (MemberBinding)Expression.Bind(p, Expression.Property(param, p)));

                cloner = Expression.Lambda<Func<TSrc, TResult>>(
                    Expression.MemberInit(
                        Expression.New(typeof(TResult)), bindings), param).Compile();
            }

            public static TResult Clone(TSrc obj)
            {
                return cloner(obj);
            }
        }
    }
}
