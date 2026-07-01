import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../api/profile';
import { getProjects, getProjectBySlug } from '../api/projects';
import { getSkills } from '../api/skills';
import { getExperience } from '../api/experience';
import { getEducation } from '../api/education';
import api from '../api/axios';

export const useProfile = () =>
  useQuery({ queryKey: ['profile'], queryFn: getProfile });

export const useProjects = (params) =>
  useQuery({ queryKey: ['projects', params], queryFn: () => getProjects(params) });

export const useProject = (slugOrId) =>
  useQuery({
    queryKey: ['project', slugOrId],
    queryFn: () => {
      // If it looks like a MongoDB ObjectId, fetch by ID directly
      if (slugOrId?.match(/^[0-9a-fA-F]{24}$/)) {
        return api.get(`/projects/${slugOrId}`).then(r => r.data);
      }
      return getProjectBySlug(slugOrId);
    },
    enabled: !!slugOrId,
  });

export const useSkills = () =>
  useQuery({ queryKey: ['skills'], queryFn: getSkills });

export const useExperience = () =>
  useQuery({ queryKey: ['experience'], queryFn: getExperience });

export const useEducation = () =>
  useQuery({ queryKey: ['education'], queryFn: getEducation });
