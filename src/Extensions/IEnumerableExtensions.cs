using System;
using System.Collections.Generic;
using System.Linq;

namespace DashAccountingSystemV2.Extensions
{
    public static class IEnumerableExtensions
    {
        /// <summary>
        /// Intended for use with parameters in Npgsql since it doesn't handle unmaterialized IEnumerables
        /// </summary>
        /// <typeparam name="TElement"></typeparam>
        /// <param name="source"></param>
        /// <returns>
        /// null if <paramref name="source"/> is empty; otherwise the value would <em>exclude all records!</em><br/>
        /// ex: the SQL would end up like: <code>[some_column_you_are_filtering_by] = ANY('{}')</code>
        /// which will return 0 results!
        /// </returns>
        public static TElement[] AsArrayOrNull<TElement>(this IEnumerable<TElement> source)
        {
            if (!source.HasAny())
                return null;

            if (source is TElement[] arraySource)
                return arraySource;

            return source.ToArray();
        }

        /// <summary>
        /// Creates enumerable from parameters
        /// </summary>
        /// <typeparam name="T">Item type</typeparam>
        /// <param name="items">items</param>
        /// <returns>IEnumerable of items</returns>
        public static IEnumerable<T> CreateEnumerable<T>(params T[] items)
        {
            return items ?? Enumerable.Empty<T>();
        }

        /// <summary>
        /// Safe alternative to IEnumerable&lt;T&gt;.Any() method that includes a null check, providing some syntactic sugar.
        /// </summary>
        /// <typeparam name="T">the type of thing in the collection</typeparam>
        /// <param name="list">IEnumerable&lt;T&gt;</param>
        /// <returns>Boolean indicating the collection is not null and has at least one item in it</returns>
        public static bool HasAny<T>(this IEnumerable<T> list)
        {
            return list != null && list.Any();
        }

        /// <summary>
        /// Safe alternative to IEnumerable&lt;T&gt;.Any() method that includes a null check, providing some syntactic sugar.
        /// </summary>
        /// <typeparam name="T">the type of thing in the collection</typeparam>
        /// <param name="list">IEnumerable&lt;T&gt;</param>
        /// <param name="predicate">Func&lt;T, bool&lt;</param>
        /// <returns>Boolean indicating the collection is not null and has at least one item in it that matches the predicate</returns>
        public static bool HasAny<T>(this IEnumerable<T> list, Func<T, bool> predicate)
        {
            return list != null && list.Any(predicate);
        }

        /// <summary>
        /// Safe alternative to IEnumerable&lt;T&gt;.Any() method that includes a null check, providing some syntactic sugar.
        /// </summary>
        /// <typeparam name="T">the type of thing in the collection</typeparam>
        /// <param name="list">IEnumerable&lt;T&gt;</param>
        /// <returns>Boolean indicating the collection is null or has no items in it</returns>
        public static bool IsEmpty<T>(this IEnumerable<T> list)
        {
            return !list.HasAny();
        }
    }
}
