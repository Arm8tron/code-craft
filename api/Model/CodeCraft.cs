using System.ComponentModel.DataAnnotations;

namespace api.Model
{
    public class CodeCraft
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string CraftId { get; set; }

        [Required]
        public string Name { get; set; }

        [Required] 
        public string CreatedBy { get; set; }

        public string Js { get; set; }

        public string Css { get; set; }

        public string Html { get; set; }

        public bool IsPublic { get; set; } = true;

        public bool IsFork { get; set; } = false;

        public int LikesCount { get; set; } = 0;

        public string LikedBy { get; set; }

        public int ViewsCount { get; set; } = 0;


    }
}
