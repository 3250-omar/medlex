import { NextResponse, type NextRequest } from "next/server";
import { signUpSchema } from "@/lib/auth/validation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createRouteClient } from "@/lib/supabase/route";

const MAX_PROFILE_IMAGE_BYTES = 5 * 1024 * 1024;
const profileImageExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: NextRequest) {
  const formData = await request.formData().catch(() => null);
  const profileImage = formData?.get("profileImage");
  const payload = signUpSchema.safeParse({
    fullName: formData?.get("fullName"),
    username: formData?.get("username"),
    phone: formData?.get("phone"),
    examDate: formData?.get("examDate"),
    email: formData?.get("email"),
    password: formData?.get("password"),
  });
  if (!payload.success) {
    return NextResponse.json(
      { error: "Please check the required fields." },
      { status: 400 },
    );
  }

  if (
    profileImage instanceof File &&
    (!profileImageExtensions[profileImage.type] ||
      profileImage.size > MAX_PROFILE_IMAGE_BYTES)
  ) {
    return NextResponse.json(
      {
        error:
          "Profile image must be a JPG, PNG, or WebP file no larger than 5 MB.",
      },
      { status: 400 },
    );
  }

  const { fullName, username, phone, examDate, email, password } = payload.data;
  const { response, supabase } = await createRouteClient(request);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        username,
        phone,
        exam_date: examDate,
      },
    },
  });

  if (error || !data.user) {
    return NextResponse.json(
      { error: error?.message ?? "Unable to create your account." },
      { status: 400 },
    );
  }

  if (profileImage instanceof File) {
    const extension = profileImageExtensions[profileImage.type];
    const avatarPath = `avatars/${data.user.id}/profile.${extension}`;

    try {
      const admin = createAdminClient();
      const { error: uploadError } = await admin.storage
        .from("profile-images")
        .upload(avatarPath, profileImage, {
          contentType: profileImage.type,
          upsert: true,
        });
      if (uploadError) throw uploadError;

      const { error: metadataError } = await admin.auth.admin.updateUserById(
        data.user.id,
        {
          user_metadata: {
            ...data.user.user_metadata,
            avatar_path: avatarPath,
          },
        },
      );
      if (metadataError) throw metadataError;

      const { error: profileError } = await admin
        .from("profiles")
        .update({ avatar_path: avatarPath })
        .eq("id", data.user.id);
      if (profileError) throw profileError;
    } catch (uploadError) {
      const res = NextResponse.json(
        {
          error:
            uploadError instanceof Error
              ? uploadError.message
              : "Your account was created, but the profile image could not be uploaded.",
        },
        { status: 500 },
      );
      response.cookies.getAll().forEach((cookie) => {
        res.cookies.set(cookie.name, cookie.value, cookie);
      });
      return res;
    }
  }

  let hasSession = Boolean(data.session);
  if (!hasSession) {
    const signInResult = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInResult.data?.session) {
      hasSession = true;
    }
  }

  const res = NextResponse.json({
    data: {
      userId: data.user.id,
      requiresEmailConfirmation: !hasSession,
    },
  });
  response.cookies.getAll().forEach((cookie) => {
    res.cookies.set(cookie.name, cookie.value, cookie);
  });
  return res;
}