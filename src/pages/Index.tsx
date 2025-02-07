import AudioRecorder from "@/components/AudioRecorder";
import TranscriptionDisplay from "@/components/TranscriptionDisplay";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-4xl py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-black">
            Viotes<span className="text-bumblebee">.AI</span>
          </h1>
          <p className="text-gray-600">
            AI-Powered Lecture Note-Taking Assistant
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <AudioRecorder />
        </div>

        <TranscriptionDisplay transcription="" />
      </div>
    </div>
  );
};

export default Index;