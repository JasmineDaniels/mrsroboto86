package com.cooksys.groupfinal.services;

import com.cooksys.groupfinal.dtos.AnnouncementDto;
import com.cooksys.groupfinal.dtos.BasicUserDto;

public interface AnnouncementService {

	AnnouncementDto getAnnouncementById(Long id);

	AnnouncementDto deleteAnnouncement(BasicUserDto basicUserDto, Long id);

}
