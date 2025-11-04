import axios from 'axios';
import { geoService } from '../src/services/geolocalizacion.service.js';

// Mock de axios compatible con módulos ES
jest.unstable_mockModule('axios', () => ({
  default: {
    post: jest.fn(),
  },
}));

describe('UC23 - Consultar ubicación a sistema de geolocalización', () => {
  // Test 1: Caso exitoso
  test(' debería devolver una dirección válida cuando la API responde correctamente', async () => {
    // Simulamos la respuesta de la API externa
    const mockResponse = {
      data: {
        direccion: 'Av. Los Eucaliptos 123, Oro Verde, Entre Ríos',
        latitud: -31.783,
        longitud: -60.516,
      },
    };

    // Mockeamos la respuesta de axios.post
    axios.post.mockResolvedValue(mockResponse);

    // Ejecutamos la función
    const resultado = await geoService.consultarUbicacion(-31.783, -60.516);

    // Verificamos el resultado
    expect(resultado.data.direccion).toBe('Av. Los Eucaliptos 123, Oro Verde, Entre Ríos');
    expect(resultado.data.latitud).toBeCloseTo(-31.783, 3);
    expect(resultado.data.longitud).toBeCloseTo(-60.516, 3);
  });

  // Test 2: Caso de error o fallo de API
  test(' debería manejar correctamente un error si la API de geolocalización falla', async () => {
    // Simulamos un fallo de la API
    axios.post.mockRejectedValue(new Error('Servicio no disponible'));

    // Verificamos que la función lance una excepción
    await expect(geoService.consultarUbicacion(-31.783, -60.516))
      .rejects
      .toThrow('Servicio no disponible');
  });
});

