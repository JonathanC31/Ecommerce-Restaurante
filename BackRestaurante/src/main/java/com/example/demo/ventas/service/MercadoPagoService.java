package com.example.demo.ventas.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MercadoPagoService {

    @Value("${mercadopago.access.token}")
    private String accessToken;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String MP_API_URL = "https://api.mercadopago.com";

    /**
     * Creates a payment preference in MercadoPago and returns the checkout URL.
     * Returns a map with: preferenceId and checkoutUrl.
     */
    public Map<String, String> crearPreferencia(double total, String referencia,
                                                 String clienteEmail, String descripcion) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + accessToken);

            Map<String, Object> item = new HashMap<>();
            item.put("title", descripcion != null && !descripcion.isBlank() ? descripcion : "Pedido Chow Yinn");
            item.put("quantity", 1);
            item.put("unit_price", total);
            item.put("currency_id", "COP");

            List<Map<String, Object>> items = new ArrayList<>();
            items.add(item);

            Map<String, Object> payer = new HashMap<>();
            payer.put("email", clienteEmail != null && !clienteEmail.isBlank()
                    ? clienteEmail : "cliente@chowyinn.com");

            Map<String, String> backUrls = new HashMap<>();
            backUrls.put("success", "http://localhost:4200/home-user?pago=aprobado");
            backUrls.put("failure", "http://localhost:4200/home-user?pago=rechazado");
            backUrls.put("pending", "http://localhost:4200/home-user?pago=pendiente");

            Map<String, Object> body = new HashMap<>();
            body.put("items", items);
            body.put("payer", payer);
            body.put("back_urls", backUrls);
            body.put("external_reference", referencia);
            body.put("notification_url", ""); // Webhooks not used in sandbox for now

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    MP_API_URL + "/checkout/preferences", request, Map.class);

            Map<String, Object> responseBody = response.getBody();
            String preferenceId = (String) responseBody.get("id");
            // sandbox_init_point is the test checkout URL
            String checkoutUrl = (String) responseBody.get("sandbox_init_point");

            Map<String, String> result = new HashMap<>();
            result.put("preferenceId", preferenceId);
            result.put("checkoutUrl", checkoutUrl);
            return result;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error comunicando con MercadoPago: " + e.getMessage());
        }
    }

    /**
     * Searches for a payment by external_reference (our venta referencia).
     * Returns: APPROVED, PENDING, REJECTED, or ERROR.
     */
    public String consultarEstadoPorReferencia(String referencia) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + accessToken);

            String url = MP_API_URL + "/v1/payments/search?external_reference=" + referencia;
            HttpEntity<Void> request = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    url, org.springframework.http.HttpMethod.GET, request, Map.class);

            Map<String, Object> body = response.getBody();
            List<Map<String, Object>> results = (List<Map<String, Object>>) body.get("results");

            if (results == null || results.isEmpty()) {
                return "PENDING";
            }

            // Get the most recent payment
            Map<String, Object> latestPayment = results.get(0);
            String status = (String) latestPayment.get("status");

            return switch (status) {
                case "approved" -> "APPROVED";
                case "rejected" -> "REJECTED";
                case "cancelled" -> "REJECTED";
                default -> "PENDING";
            };

        } catch (Exception e) {
            e.printStackTrace();
            return "ERROR";
        }
    }
}
