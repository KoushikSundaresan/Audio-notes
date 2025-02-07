import { useState, useRef, useEffect } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { pipeline } from "@huggingface/transformers";

interface AudioRecorderProps {
  onTranscriptionUpdate: (text: string) => void;
}

const AudioRecorder = ({ onTranscriptionUpdate }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcriber, setTranscriber] = useState<any>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initTranscriber = async () => {
      try {
        console.log("Initializing transcriber...");
        const whisperTranscriber = await pipeline(
          "automatic-speech-recognition",
          "onnx-community/whisper-tiny.en",
          { device: "wasm" }
        );
        setTranscriber(whisperTranscriber);
        console.log("Transcriber initialized successfully");
      } catch (error) {
        console.error("Error initializing transcriber:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to initialize speech recognition. Please try again.",
        });
      }
    };

    initTranscriber();
  }, [toast]);

  const processAudioChunk = async (audioBlob: Blob) => {
    if (!transcriber) return;

    try {
      console.log("Processing audio chunk...");
      const result = await transcriber(audioBlob);
      console.log("Transcription result:", result);
      
      if (result.text) {
        onTranscriptionUpdate(result.text);
      }
    } catch (error) {
      console.error("Error processing audio:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process audio. Please try again.",
      });
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      
      mediaRecorder.current.ondataavailable = async (e) => {
        if (e.data.size > 0) {
          console.log("Audio data available, processing chunk...");
          await processAudioChunk(e.data);
        }
      };

      // Set to capture audio in smaller chunks (every 5 seconds)
      mediaRecorder.current.start(5000);
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Your lecture is now being recorded and transcribed.",
      });
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      toast({
        title: "Recording stopped",
        description: "Your recording has been saved.",
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <div className="relative">
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center bg-bumblebee ${
            isRecording ? "animate-recording-pulse" : ""
          }`}
        >
          {isRecording ? (
            <Square
              className="w-8 h-8 text-black cursor-pointer"
              onClick={stopRecording}
            />
          ) : (
            <Mic className="w-8 h-8 text-black" />
          )}
        </div>
      </div>
      
      <Button
        variant={isRecording ? "secondary" : "default"}
        size="lg"
        onClick={isRecording ? stopRecording : startRecording}
        className={`w-48 ${
          isRecording ? "bg-black text-white" : "bg-bumblebee text-black"
        }`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </Button>
      
      {isRecording && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          Recording in progress...
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;