﻿using System.ComponentModel.DataAnnotations;

namespace AuthService.DTOs.User
{
    public class UserIn
    {
        [Required]
        public required string FirstName { get; set; }
        [Required]
        public required string LastName { get; set; }
        [Required]
        public required string Email { get; set; }
        [Required]
        public required string PhoneNumber { get; set; }

        [Required]
        public required string Password { get; set; }

        [Required]
        public required string Address { get; set; }
    }
}
