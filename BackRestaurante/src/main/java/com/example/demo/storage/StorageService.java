package com.example.demo.storage;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class StorageService {

    // Cambiaremos esto por el nombre de tu bucket cuando lo crees
    private final String BUCKET_NAME = "chowyinn-menu-images";

    public String uploadFile(MultipartFile file) throws IOException {
        // Cargar credenciales desde src/main/resources/credentials.json
        ClassPathResource resource = new ClassPathResource("credentials.json");
        GoogleCredentials credentials = GoogleCredentials.fromStream(resource.getInputStream());

        Storage storage = StorageOptions.newBuilder().setCredentials(credentials).build().getService();

        // Generar un nombre único para el archivo para evitar sobrescrituras
        String fileName = UUID.randomUUID().toString() + "-" + file.getOriginalFilename().replace(" ", "_");
        BlobId blobId = BlobId.of(BUCKET_NAME, fileName);
        
        // El contentType ayuda al navegador a saber si es PNG, JPG, etc.
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(file.getContentType()).build();

        // Subir a GCP
        storage.create(blobInfo, file.getBytes());

        // Retornar la URL pública de la imagen
        return String.format("https://storage.googleapis.com/%s/%s", BUCKET_NAME, fileName);
    }
}
