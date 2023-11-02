namespace api.Model
{
    public class LoginRequest
    {
        public string username { get; set; }

        public string password { get; set; }

        public bool remember { get; set; }
    }
}
