import React, { useEffect, useState } from 'react'
import DashboardLayout from '../component/DashboardLayout'
import { dashboardStyles as styles } from '../assets/dummystyle'
import { useNavigate } from 'react-router-dom'
import { LucideFilePlus, LucideTrash2 } from 'lucide-react'
import axiosInstance from '../util/axiosIntance'
import { AUTH_PATHS } from '../util/api'
import { ResumeSummaryCard } from '../component/Card'
import toast from 'react-hot-toast'
import moment from 'moment';
import CreateResumeForm from '../component/CreateResumeForm'
import Modal from '../component/Modal'

const Dashboard = () => {
    const navigate = useNavigate();
    const [openCreateModal, setOpenCreateModal] = useState(false)
    const [allResumes, setAllResumes] = useState([])
    const [loading, setLoading] = useState(true)
    const [resumeToDelete, setresumeToDelete] = useState(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    // Calculate completion percentage for a resume
    const calculateCompletion = (resume) => {
        let completedFields = 0;
        let totalFields = 0;

        // Profile Info
        totalFields += 3;
        if (resume.profileInfo?.fullName) completedFields++;
        if (resume.profileInfo?.designation) completedFields++;
        if (resume.profileInfo?.summary) completedFields++;

        // Contact Info
        totalFields += 2;
        if (resume.contactInfo?.email) completedFields++;
        if (resume.contactInfo?.phone) completedFields++;

        // Work Experience
        resume.workExperience?.forEach(exp => {
            totalFields += 5;
            if (exp.company) completedFields++;
            if (exp.role) completedFields++;
            if (exp.startDate) completedFields++;
            if (exp.endDate) completedFields++;
            if (exp.description) completedFields++;
        });

        // Education
        resume.education?.forEach(edu => {
            totalFields += 4;
            if (edu.degree) completedFields++;
            if (edu.institution) completedFields++;
            if (edu.startDate) completedFields++;
            if (edu.endDate) completedFields++;
        });

        // Skills
        resume.skills?.forEach(skill => {
            totalFields += 2;
            if (skill.name) completedFields++;
            if (skill.progress > 0) completedFields++;
        });

        // Projects
        resume.projects?.forEach(project => {
            totalFields += 4;
            if (project.title) completedFields++;
            if (project.description) completedFields++;
            if (project.github) completedFields++;
            if (project.liveDemo) completedFields++;
        });

        // Certifications
        resume.certifications?.forEach(cert => {
            totalFields += 3;
            if (cert.title) completedFields++;
            if (cert.issuer) completedFields++;
            if (cert.year) completedFields++;
        });

        // Languages
        resume.languages?.forEach(lang => {
            totalFields += 2;
            if (lang.name) completedFields++;
            if (lang.progress > 0) completedFields++;
        });

        // Interests
        totalFields += (resume.interests?.length || 0);
        completedFields += (resume.interests?.filter(i => i?.trim() !== "")?.length || 0);

        return Math.round((completedFields / totalFields) * 100);
    };

    const fetchAllResumes = async () => {
        try {
            setLoading(true);

            const response = await axiosInstance.get(AUTH_PATHS.RESUME.GET_ALL_RESUMES);
            console.log("API response:", response.data);

            // ✅ Extract resumes safely
            const resumesArray = response.data.resumes || [];

            // Add completion field for each resume
            const resumeWithCompletion = resumesArray.map(resume => ({
                ...resume,
                completion: calculateCompletion(resume),
            }));

            setAllResumes(resumeWithCompletion);
            console.log("Fetched resumes:", resumeWithCompletion);
        } catch (error) {
            console.error("Error fetching resumes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllResumes();

    }, [])

    const handleDeleteResume = async () => {
        if (!resumeToDelete) return;
        try {
            await axiosInstance.delete(AUTH_PATHS.RESUME.DELETE(resumeToDelete))
            toast.success("Resume Deleted");
            fetchAllResumes();
        } catch (error) {
            console.log(error);
            toast.error("Not deleted")
        }
        finally {
            setresumeToDelete(null)
            // showDeleteConfirm(false)
            setShowDeleteConfirm(false)
        }
    }

    const handleDeleteClick = async (id) => {
        setresumeToDelete(id);
        setShowDeleteConfirm(true);
    }


    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.headerWrapper}>
                    <div className="">
                        <h1 className={styles.headerTitle}>
                            My Resumes
                        </h1>
                        <p className={styles.headerSubtitle}>
                            {allResumes.length > 0 ? `You have ${allResumes.length} resumes${allResumes.length !== 1 ? 's' : ''} ` : 'Start Building Your Professionl Resumes'}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button className={styles.createButton} onClick={() => setOpenCreateModal(true)}>
                            <div className={styles.createButtonOverlay}></div>
                            <span className={styles.createButtonContent}>
                                Create Now
                                <LucideFilePlus className='group-hover:translate-x-1 transition-transform' size={18} />
                            </span>
                        </button>
                    </div>
                </div>
                {/* Loading States  */}
                {loading && (<div className={styles.spinnerWrapper}>
                    <div className={styles.spinner}></div>
                </div>)}

                {/* Empty State  */}
                {!loading && allResumes.length === 0 && (
                    <div className={styles.emptyStateWrapper}>
                        <div className={styles.emptyIconWrapper}>
                            <LucideFilePlus size={32} className='text-violet-600' />
                        </div>
                        <h3 className={styles.emptyTitle}>No Resume Yet</h3>
                        <p className={styles.emptyText}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt, repudiandae.</p>
                        <button className={styles.createButton}
                            onClick={() => setOpenCreateModal(true)}>
                            <div className={styles.createButtonOverlay}></div>
                            <span className={styles.createButtonContent}>
                                Create Your First Resume
                                <LucideFilePlus size={20} className='text-violet-600' />

                            </span>

                        </button>
                    </div>
                )}
                {/* Grid View  */}
                {!loading && allResumes.length > 0 && (
                    <div className={styles.grid}>
                        <div className={styles.newResumeCard} onClick={() => setOpenCreateModal(true)}>
                            <div className={styles.newResumeIcon}>
                                <LucideFilePlus size={32} className='text-white' />
                            </div>
                            <h3 className={styles.newResumeTitle}>
                                Create New Resume
                            </h3>
                            <p className={styles.newResumeText}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis, suscipit!</p>
                        </div>
                        {allResumes.map((resume) => (
                            <ResumeSummaryCard key={resume._id} imageUrl={resume.thmbnailLink}
                                title={resume.title} createdAt={resume.createdAt} updated={resume.updatedAt}
                                onselect={() => navigate(`/resume/${resume._id}`)}
                                onDelete={() => handleDeleteClick(resume._id)}
                                completion={resume.completion || 0}
                                resumeId={resume._id}  
                                isPremium={resume.isPremium}
                                isNew={moment().diff(moment(resume.createdAt), 'days') < 7}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Create Modal  */}
            <Modal
                isOpen={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                hideHeader
                maxWidth="max-w-2xl"
            >
                <div className="p-6">
                    <div className={styles.modalHeader}>
                        <h3 className={styles.modalTitle}>Create New Resume</h3>
                    <button onClick={() => setOpenCreateModal(false)} className={styles.modalCloseButton}>X</button>
                    </div>

                    <CreateResumeForm
                        onSuccess={() => {
                            setOpenCreateModal(false);
                            fetchAllResumes();
                        }}
                    />
                </div>
            </Modal>

            {/* Delete Modal  */}
            <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title='Confirm Deletion' showActionBtn actionBtnText='Delete'
                actionBtnClassName='bg-red-600 hover:bg-red-700' onActionClick={handleDeleteResume}>

                <div className="p-4">
                    <div className="flex flex-col items-center text-center">
                        <div className={styles.deleteIconWrapper}>
                            <LucideTrash2 className="text-orange-600" size={24} />
                        </div>
                        <h3 className={styles.deleteTitle}>Delete Resume?</h3>
                        <p className={styles.deleteText}>
                            Are you sure to delete resume?
                        </p>
                    </div>
                </div>

            </Modal>
        </DashboardLayout>
    )
}

export default Dashboard