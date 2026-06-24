package com.demoapp.demo.service;

import com.demoapp.demo.repository.UserRepository;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;

class UserServicePasswordTest {

  private final UserRepository userRepository = mock(UserRepository.class);
  private final UserService userService = new UserService(userRepository);

  @Test
  void deveAceitarSenhaForteComTodosOsRequisitos() {
    boolean resultado = userService.isPasswordValid("Senha@123");

    assertTrue(resultado);
  }

}