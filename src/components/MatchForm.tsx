import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, Upload, FileText, Video } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { UploadArea } from "./UploadArea";

const matchFormSchema = z.object({
  opponentName: z.string().min(1, "Opponent name is required").max(100),
  opponentLogo: z.instanceof(File).optional(),
  matchDate: z.date({ required_error: "Match date is required" }),
  matchType: z.enum(["home", "away"], { required_error: "Match type is required" }),
  homeLineup: z.instanceof(File).optional(),
  awayLineup: z.instanceof(File).optional(),
  homeScore: z.string().regex(/^\d+$/, "Must be a number").optional(),
  awayScore: z.string().regex(/^\d+$/, "Must be a number").optional(),
  matchVideo: z.instanceof(File),
});

type MatchFormValues = z.infer<typeof matchFormSchema>;

export function MatchForm() {
  const navigate = useNavigate();
  const [opponentLogo, setOpponentLogo] = useState<File | null>(null);
  const [homeLineup, setHomeLineup] = useState<File | null>(null);
  const [awayLineup, setAwayLineup] = useState<File | null>(null);
  const [matchVideo, setMatchVideo] = useState<File | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [matchType, setMatchType] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<MatchFormValues>({
    resolver: zodResolver(matchFormSchema),
  });

  const onSubmit = (data: MatchFormValues) => {
    console.log("Form submitted:", data);
    // Navigate to loading screen with match data
    navigate("/loading", { state: { matchData: data } });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Opponent Team Section */}
      <div className="space-y-6">
        <div>
          <Label htmlFor="opponentName" className="text-base font-semibold">
            Opponent Team
          </Label>
          <Input
            id="opponentName"
            {...register("opponentName")}
            placeholder="Enter opponent name"
            className="mt-2"
          />
          {errors.opponentName && (
            <p className="mt-1 text-sm text-destructive">{errors.opponentName.message}</p>
          )}
        </div>

        <div>
          <Label className="text-base font-semibold">Opponent Team Logo (Optional)</Label>
          <UploadArea
            icon={<Upload className="w-8 h-8 text-muted-foreground" />}
            title="Upload Team Logo"
            description="PNG, JPG up to 2MB"
            file={opponentLogo}
            onFileSelect={(file) => {
              setOpponentLogo(file);
              setValue("opponentLogo", file);
            }}
            accept="image/png,image/jpeg"
            maxSize={2}
          />
        </div>
      </div>

      {/* Match Date */}
      <div>
        <Label className="text-base font-semibold">Match Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal mt-2",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "dd/mm/yyyy"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                if (date) setValue("matchDate", date);
              }}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        {errors.matchDate && (
          <p className="mt-1 text-sm text-destructive">{errors.matchDate.message}</p>
        )}
      </div>

      {/* Match Type */}
      <div>
        <Label className="text-base font-semibold">Match Type</Label>
        <Select
          value={matchType}
          onValueChange={(value) => {
            setMatchType(value);
            setValue("matchType", value as "home" | "away");
          }}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select match type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="home">Home Game</SelectItem>
            <SelectItem value="away">Away Game</SelectItem>
          </SelectContent>
        </Select>
        {errors.matchType && (
          <p className="mt-1 text-sm text-destructive">{errors.matchType.message}</p>
        )}
      </div>

      {/* Team Lineups */}
      <div>
        <Label className="text-base font-semibold mb-4 block">Team Lineups</Label>
        <div className="grid grid-cols-2 gap-6">
          <UploadArea
            icon={<FileText className="w-8 h-8 text-muted-foreground" />}
            title="Upload Home Team Lineup"
            description="PDF, DOC, DOCX"
            file={homeLineup}
            onFileSelect={(file) => {
              setHomeLineup(file);
              setValue("homeLineup", file);
            }}
            accept=".pdf,.doc,.docx"
            maxSize={5}
          />
          <UploadArea
            icon={<FileText className="w-8 h-8 text-muted-foreground" />}
            title="Upload Away Team Lineup"
            description="PDF, DOC, DOCX"
            file={awayLineup}
            onFileSelect={(file) => {
              setAwayLineup(file);
              setValue("awayLineup", file);
            }}
            accept=".pdf,.doc,.docx"
            maxSize={5}
          />
        </div>
      </div>

      {/* Final Score */}
      <div>
        <Label className="text-base font-semibold mb-2 block">Final Score</Label>
        <div className="flex items-center gap-4 max-w-md">
          <div className="flex-1">
            <Input
              {...register("homeScore")}
              placeholder="Home"
              className="text-center text-lg font-semibold"
            />
          </div>
          <span className="text-2xl font-bold text-muted-foreground">-</span>
          <div className="flex-1">
            <Input
              {...register("awayScore")}
              placeholder="Away"
              className="text-center text-lg font-semibold"
            />
          </div>
        </div>
        {(errors.homeScore || errors.awayScore) && (
          <p className="mt-1 text-sm text-destructive">
            {errors.homeScore?.message || errors.awayScore?.message}
          </p>
        )}
      </div>

      {/* Match Video */}
      <div>
        <Label className="text-base font-semibold flex items-center gap-2">
          Match Video
          <span className="text-destructive">*</span>
        </Label>
        <UploadArea
          icon={<Video className="w-10 h-10 text-muted-foreground" />}
          title="Upload Match Video"
          description="MP4, MOV, AVI up to 500MB"
          file={matchVideo}
          onFileSelect={(file) => {
            setMatchVideo(file);
            setValue("matchVideo", file);
          }}
          accept="video/mp4,video/quicktime,video/x-msvideo"
          maxSize={500}
          required
        />
        {errors.matchVideo && (
          <p className="mt-1 text-sm text-destructive">{errors.matchVideo.message}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-6">
        <Button type="submit" className="w-full gradient-button text-lg font-semibold py-6">
          Analyze Match
        </Button>
      </div>
    </form>
  );
}
