package com.demoapp.demo.service;

import com.demoapp.demo.repository.UserRepository;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;

class UserServiceEmailTest {

  private final UserRepository userRepository = mock(UserRepository.class);
  private final UserService userService = new UserService(userRepository);

  @Test
  void deveAceitarEmailValido() {
    boolean resultado = userService.isEmailValid("teste@email.com");

    assertTrue(resultado);
  }

}