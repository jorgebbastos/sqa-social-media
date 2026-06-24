package com.demoapp.demo.controller;

import com.demoapp.demo.dto.ErrorResponse;
import com.demoapp.demo.dto.UserDTO;
import com.demoapp.demo.model.User;
import com.demoapp.demo.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AuthControllerEmailDuplicadoTest {

  private final UserService userService = mock(UserService.class);
  private final AuthController authController = new AuthController(userService);

  @Test
  void bugDeveRetornarMensagemEmailJaCadastradoQuandoEmailJaExiste() {
    UserDTO userDTO = new UserDTO();
    userDTO.setEmail("teste@email.com");
    userDTO.setPassword("Senha@123");

    User usuarioJaCadastrado = new User();
    usuarioJaCadastrado.setId(1L);
    usuarioJaCadastrado.setEmail("teste@email.com");
    usuarioJaCadastrado.setPassword("Senha@123");

    when(userService.isEmailValid(userDTO.getEmail())).thenReturn(true);
    when(userService.isPasswordValid(userDTO.getPassword())).thenReturn(true);
    when(userService.findByEmail(userDTO.getEmail())).thenReturn(usuarioJaCadastrado);

    ResponseEntity<?> response = authController.signup(userDTO);

    assertEquals(409, response.getStatusCode().value());

    ErrorResponse body = (ErrorResponse) response.getBody();
    assertNotNull(body);
    assertEquals("E-mail já cadastrado", body.getMessage());
  }

}