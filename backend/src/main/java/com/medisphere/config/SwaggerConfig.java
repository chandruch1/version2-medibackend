package com.medisphere.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI medisphereOpenAPI() {

        return new OpenAPI()
                .info(new Info()
                        .title("MediSphere Hospital Management API")
                        .description("REST APIs for Hospital Management System")
                        .version("1.0")
                        .contact(new Contact()
                                .name("Chandru")
                                .email("chandru@example.com")))
                .externalDocs(new ExternalDocumentation()
                        .description("Project Documentation"));
    }
}