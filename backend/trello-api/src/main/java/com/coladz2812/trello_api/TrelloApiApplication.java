package com.coladz2812.trello_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class TrelloApiApplication {

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(TrelloApiApplication.class);
		app.setAdditionalProfiles("local");
		app.run(args);
		System.out.println("hello");
	}

}
