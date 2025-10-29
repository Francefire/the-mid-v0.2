import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import { profile } from "@/lib/functions/profile";
import React, { useState, useEffect } from "react";
import {
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";

export const GeneralSettings = () => {
  const { user } = useAuth();
  const [userinfos, setUserinfos] = useState(null);

  useEffect(() => {
    if (user?.$id) {
      profile.getProfile(user.$id).then((response) => {
        setUserinfos(response);
      });
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* Header Card */}
        <Card className="mb-8 border-slate-200 shadow-lg">
          <CardContent className="pt-8">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
              <Avatar className="h-32 w-32 border-4 border-slate-200 shadow-md">
                <AvatarImage
                  src={userinfos?.profilePictureUrl || "/placeholder.svg"}
                  alt={userinfos?.firstName + " " + userinfos?.lastName}
                />
                <AvatarFallback className="bg-slate-700 text-2xl text-white">
                  {(userinfos?.firstName + " " + userinfos?.lastName)
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <h1 className="mb-2 text-4xl font-bold text-slate-900">
                  {userinfos?.firstName + " " + userinfos?.lastName || "User"}
                </h1>
                <p className="mb-4 text-xl text-slate-600">Profile Settings</p>

                <div className="mb-6 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-600 md:justify-start">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{user?.email || "No email provided"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {userinfos?.birthDate
                        ? new Date(userinfos.birthDate).toLocaleDateString(
                            "fr-FR"
                          )
                        : "No birth date provided"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-600">
                      Gender: {userinfos?.gender || "Not specified"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-3 md:justify-start">
                  <Button variant="outline" size="sm">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                  <Button variant="outline" size="sm">
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn
                  </Button>
                  <Button variant="outline" size="sm">
                    <Twitter className="mr-2 h-4 w-4" />
                    Twitter
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-8 md:col-span-2">
            {/* About Section */}
            <Card className="border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900">About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-slate-700">
                  {userinfos?.bio ||
                    "No bio provided yet. Add a bio to tell others about yourself."}
                </p>
              </CardContent>
            </Card>

            {/* Profile Information Section */}
            <Card className="border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl text-slate-900">
                  <Briefcase className="h-6 w-6" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-600">
                        First Name:
                      </span>
                      <span className="text-sm">
                        {userinfos?.firstName || "Not provided"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-600">
                        Last Name:
                      </span>
                      <span className="text-sm">
                        {userinfos?.lastName || "Not provided"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-600">
                        Email:
                      </span>
                      <span className="text-sm">
                        {user?.email || "Not provided"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-600">
                        Birth Date:
                      </span>
                      <span className="text-sm">
                        {userinfos?.birthDate
                          ? new Date(userinfos.birthDate).toLocaleDateString(
                              "fr-FR"
                            )
                          : "Not provided"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-600">
                        Gender:
                      </span>
                      <span className="text-sm">
                        {userinfos?.gender || "Not provided"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-600">
                        Profile Picture:
                      </span>
                      <span className="text-sm">
                        {userinfos?.profilePictureUrl ? "Yes" : "Not provided"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Information Section */}
            <Card className="border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl text-slate-900">
                  <GraduationCap className="h-6 w-6" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-slate-600">
                      User ID:
                    </span>
                    <span className="text-sm font-mono text-slate-500">
                      {user?.$id || "Not available"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-slate-600">
                      Account Status:
                    </span>
                    <span className="text-sm text-green-600">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-slate-600">
                      Profile Complete:
                    </span>
                    <span className="text-sm">
                      {userinfos?.firstName && userinfos?.lastName
                        ? "Yes"
                        : "No"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Info */}
          <div className="space-y-8">
            <Card className="border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900">
                  Quick Info
                </CardTitle>
                <CardDescription>Profile summary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-slate-600">
                      Profile Status: Active
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-slate-600">
                      Profile Picture:{" "}
                      {userinfos?.profilePictureUrl
                        ? "Uploaded"
                        : "Not uploaded"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-slate-600">
                      Bio: {userinfos?.bio ? "Added" : "Not added"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
