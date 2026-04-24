import { isValidYouTubeUrl } from "./youtube";

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateAuth(email: string, password: string) {
  if (!email.trim()) return "Email is required.";
  if (!isEmail(email)) return "Please enter a valid email.";
  if (!password.trim()) return "Password is required.";
  return "";
}

export function validateCourseTitle(title: string) {
  return title.trim() ? "" : "Course title is required.";
}

export function validateSectionYoutube(url: string) {
  return isValidYouTubeUrl(url) ? "" : "Please enter a valid YouTube URL.";
}

export function validateComment(content: string) {
  return content.trim() ? "" : "Comment cannot be empty.";
}
