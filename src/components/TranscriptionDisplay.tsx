import { Card } from "@/components/ui/card";

interface TranscriptionDisplayProps {
  transcription: string;
}

const TranscriptionDisplay = ({ transcription }: TranscriptionDisplayProps) => {
  return (
    <Card className="p-6 mt-6 bg-white shadow-lg">
      <h2 className="mb-4 text-xl font-semibold">Live Transcription</h2>
      <div className="min-h-[200px] max-h-[400px] overflow-y-auto">
        {transcription ? (
          <p className="text-gray-700 whitespace-pre-wrap">{transcription}</p>
        ) : (
          <p className="text-gray-500 italic">
            Start recording to see the transcription here...
          </p>
        )}
      </div>
    </Card>
  );
};

export default TranscriptionDisplay;