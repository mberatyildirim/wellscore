'use client';

// Client component for survey retake card with 30-day check and popup
import { useState, useEffect } from 'react';
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, X, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SurveyRetakeCardProps {
  latestResponseDate?: string; // ISO date string of last survey completion
}

export function SurveyRetakeCard({ latestResponseDate }: SurveyRetakeCardProps) {
  const [canRetake, setCanRetake] = useState(false);
  const [nextAvailableDate, setNextAvailableDate] = useState<Date | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkRetakeEligibility() {
      if (!latestResponseDate) {
        // No previous survey, can take it
        setCanRetake(true);
        setIsChecking(false);
        return;
      }

      // Calculate 30 days from last survey
      const lastSurveyDate = new Date(latestResponseDate);
      const thirtyDaysLater = new Date(lastSurveyDate);
      thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
      const now = new Date();

      if (now >= thirtyDaysLater) {
        // 30 days have passed
        setCanRetake(true);
      } else {
        // 30 days haven't passed yet
        setCanRetake(false);
        setNextAvailableDate(thirtyDaysLater);
      }

      setIsChecking(false);
    }

    checkRetakeEligibility();
  }, [latestResponseDate]);

  const handleRetakeClick = () => {
    if (canRetake) {
      // Navigate to survey
      window.location.href = '/employee/survey';
    } else {
      // Show popup
      setShowPopup(true);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (isChecking) {
    return (
      <Card className="border-orange-500/20 bg-gradient-to-br from-orange-50 to-white shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-orange-600" />
            Tekrar Değerlendirme
          </CardTitle>
          <CardDescription>
            Kontrol ediliyor...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-orange-500/20 bg-gradient-to-br from-orange-50 to-white shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-orange-600" />
            Tekrar Değerlendirme
          </CardTitle>
          <CardDescription>
            Wellbeing durumunuzu güncelleyin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleRetakeClick}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Activity className="mr-2 h-4 w-4" />
            Anketi Tekrar Yap
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Popup Dialog */}
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold text-gray-900">
                Tekrar Değerlendirme
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPopup(false)}
                className="h-6 w-6 rounded-full"
              >
                <X className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
            <DialogDescription className="text-gray-600 pt-2">
              WellScore değerlendirmesini tekrar alabilmek için en az 30 gün geçmesi gerekmektedir.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Next Available Date */}
            {nextAvailableDate && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <Calendar className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Bir sonraki değerlendirme tarihi:
                    </p>
                    <p className="text-lg font-bold text-orange-600 mt-1">
                      {formatDate(nextAvailableDate)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Info Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                Bu süre zarfında wellbeing durumunuzu destekleyecek etkinliklere katılabilirsiniz.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              asChild
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-sm"
            >
              <Link href="/employee/events" className="flex items-center justify-center">
                <ArrowRight className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="text-center">Faydalı Etkinliklere Git</span>
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

