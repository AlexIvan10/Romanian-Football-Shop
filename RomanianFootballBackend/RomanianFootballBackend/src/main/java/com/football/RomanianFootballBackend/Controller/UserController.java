package com.football.RomanianFootballBackend.Controller;

import com.football.RomanianFootballBackend.Entity.User;
import com.football.RomanianFootballBackend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        try {
            String email = authentication.getName();
            User currentUser = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

            return ResponseEntity.ok(currentUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting user info: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable int id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping
    public ResponseEntity<?> addUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.addUserByAdmin(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable int id, @RequestBody User user) {
        try {
            User updatedUser = userService.updateUser(id, user);
            if (updatedUser != null) {
                return ResponseEntity.ok(updatedUser);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating user: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable int id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting user: " + e.getMessage());
        }
    }

    @PutMapping
    public ResponseEntity<?> updateCurrentUser(@RequestBody User user, Authentication authentication) {
        try {
            String email = authentication.getName();
            User currentUser = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

            // Only update the current user's information
            return ResponseEntity.ok(userService.updateUser(currentUser.getId(), user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating user: " + e.getMessage());
        }
    }

//    @DeleteMapping
//    public ResponseEntity<?> deleteCurrentUser(Authentication authentication) {
//        try {
//            String email = authentication.getName();
//            User currentUser = userService.findByEmail(email)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//            userService.deleteUser(currentUser.getId());
//            return ResponseEntity.ok("User deleted successfully");
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body("Error deleting user: " + e.getMessage());
//        }
//    }
}
