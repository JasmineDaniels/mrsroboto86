package com.cooksys.groupfinal.controllers;

import org.springframework.web.bind.annotation.*;

import com.cooksys.groupfinal.dtos.AnnouncementDto;
import com.cooksys.groupfinal.dtos.BasicUserDto;
import com.cooksys.groupfinal.services.AnnouncementService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/announcements")
@RequiredArgsConstructor
public class AnnouncementController {
	
	private final AnnouncementService announcementService;
	
	@GetMapping("/{id}")
	@CrossOrigin(origins="*")
	public AnnouncementDto getAnnouncementById(@PathVariable Long id) {
		return announcementService.getAnnouncementById(id);
	}
	
	@DeleteMapping("/{id}")
	@CrossOrigin(origins="*")
	public AnnouncementDto deleteAnnouncement(@RequestBody BasicUserDto basicUserDto, @PathVariable Long id) {
		return announcementService.deleteAnnouncement(basicUserDto, id);
	}

}
