namespace api.Model
{
    public class RegisterRequest
    {
        public string email { get; set; }
        
        public string password { get; set; }

        public string confirm_password { get; set; }
        public string username { get; set; }

        public string name { get; set; }
    }
}
