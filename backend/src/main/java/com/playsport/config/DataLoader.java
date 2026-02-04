package com.playsport.config;

import com.playsport.model.*;
import com.playsport.repository.MatchRepository;
import com.playsport.repository.UserRepository;
import com.playsport.repository.VenueRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
public class DataLoader {

    @Bean
    public CommandLineRunner loadData(UserRepository userRepository,
                                      VenueRepository venueRepository,
                                      MatchRepository matchRepository,
                                      PasswordEncoder passwordEncoder) {
        return args -> {
            // 1. Create Demo User if not exists
            User demoUser = userRepository.findByEmail("demo@playsport.com").orElse(null);
            if (demoUser == null) {
                demoUser = new User();
                demoUser.setName("Demo User");
                demoUser.setEmail("demo@playsport.com");
                demoUser.setPasswordHash(passwordEncoder.encode("demo"));
                demoUser.getRoles().add("USER");
                userRepository.save(demoUser);
                System.out.println("Created Demo User");
            }

            // 2. Create Admin User if not exists
            User adminUser = userRepository.findByEmail("admin@playsport.com").orElse(null);
            if (adminUser == null) {
                adminUser = new User();
                adminUser.setName("Admin User");
                adminUser.setEmail("admin@playsport.com");
                adminUser.setPasswordHash(passwordEncoder.encode("admin"));
                adminUser.getRoles().add("ADMIN");
                userRepository.save(adminUser);
                System.out.println("Created Admin User");
            }

            // 3. Create Venues if none exist
            if (venueRepository.count() == 0) {
                Venue v1 = new Venue();
                v1.setName("Arena Futsal Central");
                v1.setCity("London");
                v1.setAddress("123 Oxford St");
                v1.setSportType(SportType.FUTSAL);
                v1.setHourlyRate(50.0);
                v1.setDescription("Quadra profissional de futsal com piso de madeira.");
                v1.setFacilities("Football Pitch A, Football Pitch B, Football Pitch C, Futsal Court A, Beach Soccer A");
                venueRepository.save(v1);

                Venue v2 = new Venue();
                v2.setName("Beach Soccer Paradise");
                v2.setCity("Brighton");
                v2.setAddress("Beach Front");
                v2.setSportType(SportType.BEACH_SOCCER);
                v2.setHourlyRate(40.0);
                v2.setDescription("Campo de areia oficial.");
                v2.setFacilities("Football Pitch A, Football Pitch B, Football Pitch C, Futsal Court A, Beach Soccer A");
                venueRepository.save(v2);

                Venue v3 = new Venue();
                v3.setName("Community Pitch");
                v3.setCity("London");
                v3.setAddress("Hyde Park");
                v3.setSportType(SportType.SOCCER);
                v3.setHourlyRate(60.0);
                v3.setDescription("Campo de grama sintética 7-a-side.");
                v3.setFacilities("Football Pitch A, Football Pitch B, Football Pitch C, Futsal Court A, Beach Soccer A");
                venueRepository.save(v3);

                // 4. Create Matches
                Match m1 = new Match();
                m1.setVenue(v1);
                m1.setOrganizer(demoUser);
                m1.setSportType(SportType.FUTSAL);
                m1.setStartTime(LocalDateTime.now().plusDays(2).withHour(19).withMinute(0));
                m1.setEndTime(LocalDateTime.now().plusDays(2).withHour(20).withMinute(0));
                m1.setMaxPlayers(10);
                m1.setPricePerPlayer(5.0);
                m1.setDescription("Partida casual de quarta-feira.");
                m1.setFacility("Futsal Court A");
                matchRepository.save(m1);

                Match m2 = new Match();
                m2.setVenue(v3);
                m2.setOrganizer(demoUser);
                m2.setSportType(SportType.SOCCER);
                m2.setStartTime(LocalDateTime.now().plusDays(3).withHour(18).withMinute(0));
                m2.setEndTime(LocalDateTime.now().plusDays(3).withHour(19).withMinute(30));
                m2.setMaxPlayers(14);
                m2.setPricePerPlayer(8.0);
                m2.setDescription("Futebol 7, nível intermediário.");
                m2.setFacility("Football Pitch A");
                matchRepository.save(m2);
                
                System.out.println("Created Venues and Matches");
            }
            
            System.out.println("--- Seed data check completed ---");
        };
    }
}
