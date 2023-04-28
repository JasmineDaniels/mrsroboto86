package com.cooksys.groupfinal.services;

import com.cooksys.groupfinal.dtos.ProjectDto;

import java.util.List;
import java.util.Map;

public interface ProjectService {

    ProjectDto createProject(Map<String, Object> json);

    void deleteProject(Long projectId);

    ProjectDto getProjectByProjectId(Long projectId);

    List<ProjectDto> getAllProjects();

    ProjectDto updateActiveProject(Long projectId, ProjectDto projectDto);
}
