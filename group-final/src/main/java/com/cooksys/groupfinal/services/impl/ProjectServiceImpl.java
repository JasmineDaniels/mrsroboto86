package com.cooksys.groupfinal.services.impl;

import com.cooksys.groupfinal.dtos.BasicUserDto;
import com.cooksys.groupfinal.dtos.ProjectDto;
import com.cooksys.groupfinal.entities.Project;
import com.cooksys.groupfinal.entities.Team;
import com.cooksys.groupfinal.entities.User;
import com.cooksys.groupfinal.exceptions.BadRequestException;
import com.cooksys.groupfinal.exceptions.NotAuthorizedException;
import com.cooksys.groupfinal.exceptions.NotFoundException;
import com.cooksys.groupfinal.mappers.ProjectMapper;
import com.cooksys.groupfinal.repositories.ProjectRepository;
import com.cooksys.groupfinal.repositories.TeamRepository;
import com.cooksys.groupfinal.repositories.UserRepository;
import com.cooksys.groupfinal.services.ProjectService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.Check;
import org.springframework.stereotype.Service;

import javax.persistence.Convert;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;

    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;


    @Override
    public List<ProjectDto> getAllProjects() {
        List<Project> projectList = projectRepository.findAll();
        projectList.removeIf(project -> project.isDeleted());

        //Convert List to Set
        Set<Project> projectSet = new HashSet<>(projectList);
        Set<ProjectDto> projectDtoSet = projectMapper.entitiesToDtos(projectSet);

        //Convert Set to List
        List<ProjectDto> allProjects = new ArrayList<>();
        for (ProjectDto projectDto : projectDtoSet){
            allProjects.add(projectDto);
        }

        return allProjects;
    }

    @Override
    public ProjectDto createProject(Map<String, Object> json) {

        //Convert JSON data to Data Transfer Object
        BasicUserDto basicUserDto = objectMapper.convertValue(json.get("user"), new TypeReference<BasicUserDto>() {});
        ProjectDto projectDto = objectMapper.convertValue(json.get("project"), new TypeReference<ProjectDto>() {});

        //Check for null user and project values
        if(basicUserDto == null  || projectDto == null){
            throw new BadRequestException("Project & User cannot be null");
        }

        if (projectDto.getTeam() == null || projectDto.getTeam().getId() == null){
            throw new BadRequestException("The given team must not be null");
        }

        //Check if the project author exists in DB
        Optional<User> optionalUser = userRepository.findById(basicUserDto.getId());

        if (optionalUser.isEmpty()){
            throw new NotFoundException("No user exists with this id:" + basicUserDto.getId());
        }

        User user = optionalUser.get();

        //Check if the project author is an Administrator
        if(!user.isAdmin()){
            throw new NotAuthorizedException("You are not authorized to do this action.");
        }

        //Check if the Team Exists
        if(teamRepository.findById(projectDto.getTeam().getId()).isPresent()){
            Team team = teamRepository.findById(projectDto.getTeam().getId()).get();

            Project project = projectRepository.saveAndFlush(projectMapper.dtoToEntity(projectDto));

            Set<Project> teamProjects = team.getProjects();
            teamProjects.add(project);
            teamRepository.saveAndFlush(team);

            return projectMapper.entityToDto(projectRepository.saveAndFlush(project));
        } else {
            throw new NotFoundException("No Team exists with this id: " + projectDto.getTeam().getId());
        }
    }

    @Override
    public void deleteProject(Long projectId) {

        if (projectRepository.findById(projectId).isPresent()){
            Project projectToDelete = projectRepository.findById(projectId).get();

            Team team = projectToDelete.getTeam();
            team.getProjects().remove(projectToDelete);

            projectToDelete.setDeleted(true);
            projectToDelete.setActive(false);
            projectToDelete.setTeam(null);

            teamRepository.saveAndFlush(team);

        } else {
            throw new NotFoundException("No Project exists with this id: " + projectId);
        }
    }

    @Override
    public ProjectDto getProjectByProjectId(Long projectId) {

        Optional<Project> projectToFind = projectRepository.findById(projectId);

        if (projectToFind.isEmpty()){
            throw new NotFoundException("No project exists with this id: " + projectId);
        } else if (projectToFind.get().isDeleted()){
            throw new NotFoundException("No project exists with this id: " + projectId);
        }else {
            return projectMapper.entityToDto(projectRepository.findById(projectId).get());
        }
    }

    @Override
    public ProjectDto updateActiveProject(Long projectId, ProjectDto projectDto) {
        Optional<Project> projectToFind = projectRepository.findById(projectId);

        if(projectToFind.isEmpty()){
            throw new NotFoundException("No project exists with this id: " + projectId);
        } else {
            Project project = projectToFind.get();
            project.setActive(projectDto.isActive());
            return projectMapper.entityToDto(projectRepository.saveAndFlush(project));
        }
    }

}
