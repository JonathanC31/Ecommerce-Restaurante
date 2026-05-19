package com.example.demo.ventas.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class WompiService {

    @Value("${wompi.public.key:pub_test_dummy}")
    private String publicKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String WOMPI_URL = "https://sandbox.wompi.co/v1";

    public String generarTransaccionNequi(double total, String celular, String referencia, String email) {
        try {
            String merchantUrl = WOMPI_URL + "/merchants/" + publicKey;
            ResponseEntity<Map> merchantResponse = restTemplate.getForEntity(merchantUrl, Map.class);
            Map<String, Object> data = (Map<String, Object>) merchantResponse.getBody().get("data");
            Map<String, Object> presigned = (Map<String, Object>) data.get("presigned_acceptance");
            String acceptanceToken = (String) presigned.get("acceptance_token");

            String txUrl = WOMPI_URL + "/transactions";
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + publicKey);
            
            Map<String, Object> requestBody = Map.of(
                    "amount_in_cents", (long) (total * 100),
                    "currency", "COP",
                    "customer_email", email != null && !email.isBlank() ? email : "cliente@correo.com",
                    "payment_method", Map.of(
                            "type", "NEQUI",
                            "phone_number", celular
                    ),
                    "reference", referencia,
                    "acceptance_token", acceptanceToken
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> txResponse = restTemplate.postForEntity(txUrl, request, Map.class);

            Map<String, Object> txData = (Map<String, Object>) txResponse.getBody().get("data");
            return (String) txData.get("id");

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error comunicando con Wompi: " + e.getMessage());
        }
    }

    public String consultarEstado(String transaccionId) {
        try {
            String url = WOMPI_URL + "/transactions/" + transaccionId;
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            Map<String, Object> data = (Map<String, Object>) response.getBody().get("data");
            return (String) data.get("status");
        } catch (Exception e) {
            e.printStackTrace();
            return "ERROR";
        }
    }
}
