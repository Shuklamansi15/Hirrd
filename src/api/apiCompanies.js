import supabaseClient, { supabaseUrl } from "@/utils/supabase";

// Fetch Companies
export async function getCompanies(token) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase.from("companies").select("*");

  if (error) {
    console.error("Error fetching Companies:", error.message);
    return null;
  }

  return data;
}

// Add Company
export async function addNewCompany(token, _, companyData) {
  const supabase = await supabaseClient(token);

  try {
    // ✅ Ensure logo is a valid File or Blob
    if (!(companyData.logo instanceof File || companyData.logo instanceof Blob)) {
      throw new Error("Invalid logo file. Must be a File or Blob object.");
    }

    // ✅ Generate unique file name
    const random = Math.floor(Math.random() * 90000);
    const fileExt = companyData.logo.name?.split(".").pop() || "png";
    const fileName = `logo-${random}-${companyData.name}.${fileExt}`;

    // ✅ Upload to Supabase storage with proper metadata
    const { error: storageError } = await supabase.storage
      .from("company-logo")
      .upload(fileName, companyData.logo, {
        cacheControl: "3600",
        upsert: false,
        contentType: companyData.logo.type || "image/png",
      });

    if (storageError) {
      console.error("Storage upload error:", storageError.message);
      throw new Error("Error uploading company logo.");
    }

    // ✅ Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("company-logo")
      .getPublicUrl(fileName);

    const logo_url = publicUrlData.publicUrl;

    // ✅ Insert into database
    const { data, error } = await supabase
      .from("companies")
      .insert([
        {
          name: companyData.name,
          logo_url: logo_url,
        },
      ])
      .select();

    if (error) {
      console.error("Database insert error:", error.message);
      throw new Error("Error inserting company record.");
    }

    return data;
  } catch (err) {
    console.error("Add Company failed:", err.message);
    throw err;
  }
}
