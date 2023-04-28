package com.cooksys.groupfinal.services.impl;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.cooksys.groupfinal.dtos.AnnouncementDto;
import com.cooksys.groupfinal.dtos.BasicUserDto;
import com.cooksys.groupfinal.entities.Announcement;
import com.cooksys.groupfinal.exceptions.NotAuthorizedException;
import com.cooksys.groupfinal.exceptions.NotFoundException;
import com.cooksys.groupfinal.mappers.AnnouncementMapper;
import com.cooksys.groupfinal.repositories.AnnouncementRepository;
import com.cooksys.groupfinal.services.AnnouncementService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AnnouncementServiceImpl implements AnnouncementService {
	
	private final AnnouncementRepository announcementRepository;
	private final AnnouncementMapper announcementMapper;
	
	public Announcement findAnnouncement(Long id) {
		
		Optional<Announcement> announcementSearch = announcementRepository.findById(id);
		
		if (announcementSearch.isEmpty()) {
			throw new NotFoundException("The announcement with the provided id doesn't exist.");
		}
		
		Announcement announcement = announcementSearch.get();
		if (announcement.isDeleted()) {
			throw new NotFoundException("The announcement with the provided id doesn't exist.");
		} else {
			return announcement;
		}
	}
	
	@Override
	public AnnouncementDto getAnnouncementById(Long id) {
		
		Announcement announcment = findAnnouncement(id);
		
		return announcementMapper.entityToDto(announcment);
		
	}

	@Override
	public AnnouncementDto deleteAnnouncement(BasicUserDto basicUserDto, Long id) {
			
		Announcement announcement = findAnnouncement(id);
		
		if (basicUserDto.isAdmin()) {
			announcement.setDeleted(true);
			return announcementMapper.entityToDto(announcementRepository.saveAndFlush(announcement));
		} else {
			throw new NotAuthorizedException("You do not have authorization do that action.");
		}
		
	}

}