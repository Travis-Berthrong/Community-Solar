﻿using System.ComponentModel.DataAnnotations;

namespace AuthService.DTOs.UserDtos
{
    public class UserLogin
    {
        [Required, EmailAddress]
        public required string Email { get; set; }
        [Required]
        public required string Password { get; set; }
    }
}
