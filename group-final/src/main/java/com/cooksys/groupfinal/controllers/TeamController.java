package com.cooksys.groupfinal.controllers;

import java.util.Set;

import org.springframework.web.bind.annotation.*;

import com.cooksys.groupfinal.dtos.TeamDto;
import com.cooksys.groupfinal.services.TeamService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/team")
@RequiredArgsConstructor
public class TeamController {

	private final TeamService teamService;

	@GetMapping("/user/{id}")
	@CrossOrigin(origins="*")
	public Set<TeamDto> getTeams(@PathVariable Long id) {
		return teamService.getTeams(id);
	}

	@PostMapping("/{authorId}/company/{companyId}")
	@CrossOrigin(origins="*")
	public TeamDto createTeam(@PathVariable Long authorId, @PathVariable Long companyId, @RequestBody TeamDto teamDto) {
		return teamService.createTeam(authorId,companyId, teamDto);
	}

	@DeleteMapping("/{teamId}")
	@CrossOrigin(origins="*")
	public TeamDto deleteTeam(@PathVariable Long teamId) {
		return teamService.deleteTeam(teamId);
	}
}