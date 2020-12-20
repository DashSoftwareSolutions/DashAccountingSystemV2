using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.Extensions
{
    public static class PaginationExtensions
    {
        /// <summary>
		/// Extension method to get paged result
		/// </summary>
		/// <typeparam name="TData"></typeparam>
		/// <param name="query"></param>
		/// <param name="pagination"></param>
		/// <returns></returns>
		public static PagedResult<TData> GetPaged<TData>(this IQueryable<TData> query, Pagination pagination)
            where TData : class
        {
            var result = new PagedResult<TData>();
            result.Pagination = pagination;
            result.Pagination.RecordCount = query.Count();

            // If pageNumber is null, default to the first page
            var pageNumber = pagination.PageNumber.HasValue ? (pagination.PageNumber.Value > 0 ? pagination.PageNumber.Value : 1) : 1;
            pagination.PageNumber = pageNumber;

            // If pageSize is null, default to the record count
            var pageSize = pagination.PageSize.HasValue ? (pagination.PageSize.Value > 0 ? pagination.PageSize.Value : result.Pagination.RecordCount) : result.Pagination.RecordCount;
            pagination.PageSize = pageSize;

            var pageCount = (double)result.Pagination.RecordCount / pageSize;
            result.Pagination.PageCount = (int)Math.Ceiling(pageCount);

            result.Pagination.ContainsMoreRecords = pagination.RecordCount > (pageNumber * pageSize);

            var skip = (pageNumber - 1) * pageSize;
            result.Results = query.Skip(skip).Take(pageSize).ToList();

            return result;
        }

        public static async Task<PagedResult<TData>> GetPagedAsync<TData>(this IQueryable<TData> query, Pagination pagination)
            where TData : class
        {
            var result = new PagedResult<TData>();
            result.Pagination = pagination;
            result.Pagination.RecordCount = await query.CountAsync();

            // If pageNumber is null, default to the first page
            var pageNumber = pagination.PageNumber.HasValue ? (pagination.PageNumber.Value > 0 ? pagination.PageNumber.Value : 1) : 1;
            pagination.PageNumber = pageNumber;

            // If pageSize is null, default to the record count
            var pageSize = pagination.PageSize.HasValue ? (pagination.PageSize.Value > 0 ? pagination.PageSize.Value : result.Pagination.RecordCount) : result.Pagination.RecordCount;
            pagination.PageSize = pageSize;

            var pageCount = (double)result.Pagination.RecordCount / pageSize;
            result.Pagination.PageCount = (int)Math.Ceiling(pageCount);

            result.Pagination.ContainsMoreRecords = pagination.RecordCount > (pageNumber * pageSize);

            var skip = (pageNumber - 1) * pageSize;
            result.Results = await query.Skip(skip).Take(pageSize).ToListAsync();

            return result;
        }
    }
}
