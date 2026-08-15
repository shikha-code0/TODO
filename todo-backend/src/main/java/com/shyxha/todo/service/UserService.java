package com.shyxha.todo.service;
import com.shyxha.todo.dto.LoginRequest;
import com.shyxha.todo.dto.LoginResponse;
import com.shyxha.todo.dto.RegisterRequest;

public interface UserService {

    String register(RegisterRequest request);

    LoginResponse login(LoginRequest request);
}


