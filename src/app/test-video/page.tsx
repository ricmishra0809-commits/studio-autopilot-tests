'use client';
import { TestVideoForm } from './_components/test-video-form';
import { getVideo } from './actions';

export default function TestVideoPage() {
  return <TestVideoForm getVideo={getVideo} />;
}
