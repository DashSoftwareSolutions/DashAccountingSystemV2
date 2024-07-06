using System;

namespace DashAccountingSystemV2.BackEnd.Models
{
    public sealed class Gender : IEquatable<Gender>
    {
        private readonly char _gender;

        private Gender(char gender)
        {
            if (!IsValidGender(gender))
            {
                throw new ArgumentOutOfRangeException(nameof(gender), "Gender must be 'M' or 'F'");
            }

            _gender = gender.ToString().ToUpper()[0];
        }

        public static Gender Male = new Gender('M');

        public static Gender Female = new Gender('F');

        public bool Equals(Gender other)
        {
            if (other == null)
                return false;

            return string.Equals(_gender.ToString(), other._gender.ToString(), StringComparison.OrdinalIgnoreCase);
        }

        public override bool Equals(object obj)
        {
            if (obj is Gender other)
                return Equals(other);

            return false;
        }

        public override int GetHashCode()
        {
            return _gender.GetHashCode();
        }

        public override string ToString()
        {
            if (Equals(Male))
                return "Male";

            if (Equals(Female))
                return "Female";

            return string.Empty;
        }

        private static bool IsValidGender(char gender)
        {
            return gender.ToString().ToUpper() == "M" || gender.ToString().ToUpper() == "F";
        }

        public static explicit operator Gender(char gender)
        {
            if (IsValidGender(gender))
                return new Gender(gender);

            return null;
        }

        public static explicit operator char?(Gender gender)
        {
            if (gender == null)
                return null;

            return gender._gender;
        }
    }
}
