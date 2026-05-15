// GET /api/student/dashboard

import dbConnect from "@/app/_lib/dbConnect";
import HiringProcess from "@/app/models/HiringProcessModel";
import { Notification } from "@/app/models/NotificationModel";
import { Reel } from "@/app/models/ReelModel";
import StudentProfile from "@/app/models/StudentProfileModel";
import { View } from "@/app/models/ViewModel";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    /* 🎓 PROFILE */

    //     const PROFILE_WEIGHTS = {
    //   basic: 15,       // rollno, degree, branch, year
    //   academics: 10,   // cgpa
    //   skills: 20,
    //   projects: 20,
    //   resume: 10,
    //   links: 10,       // github + linkedin
    //   bio: 5,
    //   verification: 10,
    // };
    const profile = await StudentProfile.findOne({ userId }, { embedding: 0 });

    let completion = 0;
    const suggestions: string[] = [];

    // 🧩 BASIC INFO
    if (profile?.degree && profile?.branch && profile?.yearOfPassing) {
      completion += 15;
    } else {
      suggestions.push("Complete your basic academic details");
    }

    // 🎓 CGPA
    if (profile?.cgpa) {
      completion += 10;
    } else {
      suggestions.push("Add your CGPA");
    }

    // 🧠 SKILLS (depth-based)
    if (profile?.skills?.length) {
      const skillScore = Math.min(profile.skills.length * 4, 20); // max 20
      completion += skillScore;

      if (profile.skills.length < 5) {
        suggestions.push("Add more skills to strengthen your profile");
      }
    } else {
      suggestions.push("Add your skills");
    }

    // 🛠 PROJECTS (assuming you have Project model)
    const projectCount = profile?.projects?.length || 0;
    if (projectCount) {
      const projectScore = Math.min(projectCount * 5, 20); // max 20
      completion += projectScore;

      if (projectCount < 3) {
        suggestions.push("Add more projects to stand out");
      }
    } else {
      suggestions.push("Add projects to your profile");
    }

    // 📄 RESUME
    if (profile?.resumeUrl) {
      completion += 10;
    } else {
      suggestions.push("Upload your resume");
    }

    // 🔗 LINKS
    let linksScore = 0;

    if (profile?.github) linksScore += 5;
    else suggestions.push("Link your GitHub");

    if (profile?.linkedin) linksScore += 5;
    else suggestions.push("Link your LinkedIn");

    completion += linksScore;

    // 🧾 BIO
    if (profile?.bio) {
      completion += 5;
    } else {
      suggestions.push("Add a bio to improve visibility");
    }

    // ✅ VERIFICATION
    if (profile?.verified) {
      completion += 10;
    } else {
      suggestions.push("Verify your profile");
    }

    // 🧮 Clamp (just in case)
    completion = Math.min(completion, 100);

    /* 📅 INTERVIEWS */
    const interviews = await HiringProcess.find({
      studentId: userId,
      status: "interview_scheduled",
    })
      .sort({ interviewDate: 1 })
      .populate({
        path: "employerId",
        select: "name", // only fetch name
      });

    // const today = new Date();

    // const todayInterviews = interviews.filter((i) => {
    //   const d = new Date(i.interviewDate);
    //   return d.toDateString() === today.toDateString();
    // });

    /* 🎬 REELS ANALYTICS */
    const reels = await Reel.find({ userId }).select("_id");
    const reelIds = reels.map((r) => r._id);

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const dailyViews = await View.aggregate([
      {
        $match: {
          reelId: { $in: reelIds },
          watchedAt: { $gte: ninetyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$watchedAt" },
          },
          views: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const dateMap = new Map(dailyViews.map((d) => [d._id, d.views]));

    const fullData: { date: string; views: number }[] = [];

    for (let i = 0; i < 90; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (89 - i));

      const key = d.toISOString().split("T")[0];

      fullData.push({
        date: key,
        views: dateMap.get(key) || 0,
      });
    }

    /* ⚡ ACTIVITY (basic for now) */
    const notifications = await Notification.find({
      recipientId: userId,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    const activity: string[] = [];

    // 🎯 INTERVIEWS
    if (interviews.length > 0) {
      activity.push(
        `📅 ${interviews.length} interview${interviews.length > 1 ? "s" : ""} scheduled`,
      );
    }

    // 🎥 REELS PERFORMANCE
    const totalViews = reels.reduce((sum, r) => sum + (r.viewsCount || 0), 0);

    if (totalViews > 0) {
      activity.push(`🎥 Your reels got ${totalViews} views`);
    }

    // 🔔 NOTIFICATIONS BREAKDOWN
    const counts = {
      shortlist: 0,
      like: 0,
      comment: 0,
      interview: 0,
    };

    const recentNotifications = notifications.filter((n) => {
      const diff = Date.now() - new Date(n.createdAt).getTime();
      return diff < 1000 * 60 * 60 * 48; // last 48h
    });

    // if (recentNotifications.length > 0) {
    //   activity.unshift(`⚡ ${recentNotifications.length} new update${recentNotifications.length > 1 ? "s" : ""} today`);
    // }

    recentNotifications.forEach((n) => {
      counts[n.type]++;
    });

    // 🧠 SHORTLISTS (high signal)
    if (counts.shortlist > 0) {
      activity.push(
        `🔥 ${counts.shortlist} recruiter${counts.shortlist > 1 ? "s" : ""} shortlisted you`,
      );
    }

    // ❤️ LIKES
    if (counts.like > 0) {
      activity.push(`❤️ ${counts.like} people liked your reels`);
    }

    // 💬 COMMENTS
    if (counts.comment > 0) {
      activity.push(
        `💬 ${counts.comment} new comment${counts.comment > 1 ? "s" : ""}`,
      );
    }

    // 📅 INTERVIEW NOTIFICATIONS (extra layer)
    if (counts.interview > 0) {
      activity.push(
        `📩 ${counts.interview} interview update${counts.interview > 1 ? "s" : ""}`,
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        name: session.user?.name || "User",

        profile: {
          completion,
          suggestions: suggestions.slice(0, 3),
        },

        // interviews: {
        //   //   todayCount: todayInterviews.length,
        //   //   nextInterview: interviews[0]?.interviewDate || null,
        //   all: interviews.map((i) => ({
        //     id: i._id,
        //     role: i.role,
        //     date: i.interviewDate,
        //   })),
        // },
        interviews: interviews.map((i) => ({
          id: i._id,
          name: i.employerId?.name || "Unknown",
          role: i.role,
          interviewDate: new Date(i.interviewDate),
          inteviewLink: i.interviewLink,
        })),

        activity: activity.slice(0, 3),

        analytics: fullData,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}
