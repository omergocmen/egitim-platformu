"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { toYouTubeThumbnailUrl } from "@/lib/youtube";

type Props = {
  course: {
    id: number;
    title: string;
    description: string;
    thumbnailUrl: string | null;
    firstYoutubeUrl?: string | null;
    sectionCount?: number;
  };
  testId: string;
};

export default function CourseCard({ course, testId }: Props) {
  const fallbackThumb = useMemo(() => toYouTubeThumbnailUrl(course.firstYoutubeUrl || ""), [course.firstYoutubeUrl]);
  const [imageUrl, setImageUrl] = useState(course.thumbnailUrl || fallbackThumb);

  function handleImageError() {
    setImageUrl((current) => (current !== fallbackThumb ? fallbackThumb : ""));
  }

  return (
    <Link className="course-tile" data-testid={testId} href={`/courses/${course.id}`}>
      <div className="course-media">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" onError={handleImageError} />
        ) : (
          <div className="course-placeholder" aria-hidden="true">
            <span>LearnLite</span>
          </div>
        )}
        <span className="course-chip">{course.sectionCount || 0} lessons</span>
      </div>
      <div className="course-copy">
        <strong>{course.title}</strong>
        <span>{course.description}</span>
      </div>
    </Link>
  );
}
