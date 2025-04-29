export default function Head() {
  return (
    <>
      <title>Workout Generator – create cycling workouts</title>
      <meta
        name="description"
        content="Generate indoor-cycling workouts (TXT & Zwift ZWO) from FTP, duration and template. Free, no sign-up."
      />
      {/* Open Graph */}
      <meta property="og:title" content="Workout Generator" />
      <meta
        property="og:description"
        content="Create ready-to-ride workouts and export to Zwift."
      />
      <meta property="og:image" content="/og.png" />
      <meta property="og:type" content="website" />
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
    </>
  )
}