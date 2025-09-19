import { VisualRecorderForm } from "./_components/visual-recorder-form";
import { manageVisualTestSession } from "@/ai/flows/record-visual-test";

export const maxDuration = 120; // 2 minutes

export default async function VisualRecorderPage() {

    async function runSession(data: any) {
        'use server';
        return await manageVisualTestSession(data);
    }

    return <VisualRecorderForm runSession={runSession} />;
}
