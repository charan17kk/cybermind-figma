import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const JOBS_FILE_PATH = path.join(process.cwd(), 'src/data/jobs.json');

// GET /api/local-jobs - Get all jobs from local JSON
export async function GET() {
  try {
    const fileContent = await fs.readFile(JOBS_FILE_PATH, 'utf-8');
    const data = JSON.parse(fileContent);
    return NextResponse.json({ success: true, data: data.jobs });
  } catch (error) {
    console.error('Error reading jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// POST /api/local-jobs - Create a new job in local JSON
export async function POST(request: NextRequest) {
  try {
    const jobData = await request.json();
    const fileContent = await fs.readFile(JOBS_FILE_PATH, 'utf-8');
    const data = JSON.parse(fileContent);

    // Use salary as is since it's already formatted from the client
    const salary = jobData.salary;
    const salaryValue = parseFloat(salary.replace(/[^\d.]/g, ''));
    const monthlyAmount = Math.round((salaryValue * 100000) / 12);
    const monthlySalary = monthlyAmount >= 100000 
      ? `₹${(monthlyAmount / 100000).toFixed(1)}L/month`
      : `₹${Math.round(monthlyAmount / 1000)}k/month`;

    const newJob = {
      ...jobData,
      id: Math.random().toString(36).substr(2, 9),
      salary,
      monthlySalary,
      createdAt: new Date().toISOString(),
      postedDate: "Just now",
      isActive: true
    };

    data.jobs.unshift(newJob); // Add new job at the beginning
    await fs.writeFile(JOBS_FILE_PATH, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true, data: newJob });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create job' },
      { status: 500 }
    );
  }
}