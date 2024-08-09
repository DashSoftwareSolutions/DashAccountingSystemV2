namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public class LookupValueViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public LookupValueViewModel() { }

        public LookupValueViewModel(int id, string name)
        {
            Id = id;
            Name = name;
        }
    }
}
