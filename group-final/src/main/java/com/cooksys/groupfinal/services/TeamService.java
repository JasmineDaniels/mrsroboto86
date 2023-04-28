package com.cooksys.groupfinal.services;

import java.util.Set;

import com.cooksys.groupfinal.dtos.TeamDto;

public interface TeamService {

	Set<TeamDto> getTeams(Long id);

	TeamDto createTeam(Long authorId, Long companyId, TeamDto teamRequestDto);

	TeamDto deleteTeam(Long id);
	
}