import { useState, useRef } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          console.log("Audio data available:", e.data);
          // Here we'll later implement the processing logic
        }
      };

      mediaRecorder.current.start();
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