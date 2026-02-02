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
@Profile("dev")
public class DataLoader {

    @Bean
    public CommandLineRunner loadData(UserRepository userRepository,
                                      VenueRepository venueRepository,
                                      MatchRepository matchRepository,
                                      PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() > 0) return;

            User demoUser = new User();
            demoUser.setName("Demo User");
            demoUser.setEmail("demo@playsport.com");
            demoUser.setPasswordHash(passwordEncoder.encode("demo"));
            userRepository.save(demoUser);

            Venue v1 = new Venue();
            v1.setName("Arena Futsal Central");
            v1.setCity("London");
            v1.setAddress("123 Oxford St");
            v1.setSportType(SportType.FUTSAL);
            v1.setHourlyRate(50.0);
            v1.setDescription("Quadra profissional de futsal com piso de madeira.");
            venueRepository.save(v1);

            Venue v2 = new Venue();
            v2.setName("Beach Soccer Paradise");
            v2.setCity("Brighton");
            v2.setAddress("Beach Front");
            v2.setSportType(SportType.BEACH_SOCCER);
            v2.setHourlyRate(40.0);
            v2.setDescription("Campo de areia oficial.");
            venueRepository.save(v2);

            Venue v3 = new Venue();
            v3.setName("Community Pitch");
            v3.setCity("London");
            v3.setAddress("Hyde Park");
            v3.setSportType(SportType.SOCCER);
            v3.setHourlyRate(60.0);
            v3.setDescription("Campo de grama sintética 7-a-side.");
            venueRepository.save(v3);

            Match m1 = new Match();
            m1.setVenue(v1);
            m1.setOrganizer(demoUser);
            m1.setSportType(SportType.FUTSAL);
            m1.setStartTime(LocalDateTime.now().plusDays(2).withHour(19).withMinute(0));
            m1.setEndTime(LocalDateTime.now().plusDays(2).withHour(20).withMinute(0));
            m1.setMaxPlayers(10);
            m1.setPricePerPlayer(5.0);
            m1.setDescription("Partida casual de quarta-feira.");
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
            matchRepository.save(m2);

            System.out.println("--- Seed data loaded ---");
        };
    }
}
