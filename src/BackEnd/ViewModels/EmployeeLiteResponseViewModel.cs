using System;
using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public class EmployeeLiteResponseViewModel
    {
        public Guid Id { get; set; }

        public uint EmployeeNumber { get; set; }

        public string DisplayName { get; set; }

        public bool IsBillableByDefault { get; set; }

        public decimal? HourlyBillableRate { get; set; }

        public bool IsUser => UserId.HasValue;

        public Guid? UserId { get; set; }

        public static EmployeeLiteResponseViewModel FromModel(Employee employee)
        {
            if (employee == null)
                return null;

            return new EmployeeLiteResponseViewModel()
            {
                Id = employee.EntityId,
                EmployeeNumber = employee.EmployeeNumber,
                DisplayName = employee.DisplayName,
                UserId = employee.UserId,
                IsBillableByDefault = employee.IsBillableByDefault,
                HourlyBillableRate = employee.HourlyBillingRate,
            };
        }
    }
}
