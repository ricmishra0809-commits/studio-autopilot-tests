'use server';

import { db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export async function saveTestResult(result: {
    summary: string;
    steps: any[];
    video?: string | null;
    url: string;
    task: string;
}) {
    let videoUrl = null;
    let status: 'Pass' | 'Fail' = 'Pass'; // Default to Pass

    // Determine status
    const hasFailedStep = result.steps.some(step => step.action.includes('FAILED'));
    const hasAssertionFailure = result.steps.some(step => step.observation.includes('Assertion failed'));
    if (hasFailedStep || hasAssertionFailure) {
        status = 'Fail';
    }


    if (result.video) {
        const videoId = uuidv4();
        const storageRef = ref(storage, `test-videos/${videoId}.webm`);
        // The video is a data URI, we need to extract the base64 part
        const base64Data = result.video.split(',')[1];
        try {
            const snapshot = await uploadString(storageRef, base64Data, 'base64', { contentType: 'video/webm' });
            videoUrl = await getDownloadURL(snapshot.ref);
        } catch (error) {
            console.error("Error uploading video to Firebase Storage:", error);
        }
    }

    try {
        await addDoc(collection(db, 'test-runs'), {
            url: result.url,
            task: result.task,
            summary: result.summary,
            steps: result.steps.map(s => ({...s, screenshot: ''})), // Don't save large screenshots in firestore
            videoUrl: videoUrl,
            status: status,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error saving test result to Firestore:", error);
    }
}

export async function getTestRuns() {
    const q = query(collection(db, "test-runs"), orderBy("createdAt", "desc"), limit(20));
    const querySnapshot = await getDocs(q);
    const testRuns: any[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        testRuns.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt.toDate().toLocaleString(),
        });
    });
    return testRuns;
}
