using System;
using System.Collections.Generic;
using System.Linq;

namespace DashAccountingSystemV2.Extensions
{
    public static class IEnumerableExtensions
    {
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
