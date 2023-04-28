package com.cooksys.groupfinal.controllers;

import com.cooksys.groupfinal.dtos.ProjectDto;
import com.cooksys.groupfinal.services.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectController {
	
	private final ProjectService projectService;

	@GetMapping
	@CrossOrigin(origins="*")
	public List<ProjectDto> getAllProjects(){
		return projectService.getAllProjects();
	}

	@GetMapping("/{projectId}")
	@CrossOrigin(origins="*")
	public ProjectDto getProjectByProjectId(@PathVariable Long projectId){
		return projectService.getProjectByProjectId(projectId);
	}

	@PostMapping
	@CrossOrigin(origins="*")
	public ProjectDto createProject(@RequestBody Map<String, Object> json ){
		return projectService.createProject(json);
	}

	@DeleteMapping("/{projectId}")
	@CrossOrigin(origins="*")
	public void deleteProject(@PathVariable Long projectId){
		projectService.deleteProject(projectId);
	}

	@PatchMapping("/{projectId}")
	@CrossOrigin(origins="*")
	public ProjectDto updateActiveProject(@PathVariable Long projectId, @RequestBody ProjectDto projectDto){
		return projectService.updateActiveProject(projectId, projectDto);
	}

}
