using System.ComponentModel.DataAnnotations;

namespace api.Model
{
    public class User
    {
        [Key]
        public string username { get; set; }

        public string email { get; set; }

        public string passwordhash { get; set; }


    }
}
