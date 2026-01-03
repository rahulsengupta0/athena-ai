const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Project = require('../model/Project');
const Favorite = require('../model/Favorite');
const BrandKit = require('../model/BrandKit');
const User = require('../model/User');
const UserFile = require('../model/UserFile');
const s3 = require('../utils/s3');
const { sendBrandKitShareEmail } = require('../utils/emailService');

// ============= PROJECT ROUTES =============

// Get user's projects (own + shared as collaborator)
router.get('/projects', auth, async (req, res) => {
  try {
    const [own, shared] = await Promise.all([
      Project.find({ userId: req.user.id }),
      Project.find({ collaborators: req.user.id })
    ]);
    const projects = [...own, ...shared];
    res.json(projects);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get a single project by ID
router.get('/projects/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user.id });
    if (!project) {
      // Also check if the user is a collaborator
      const sharedProject = await Project.findOne({ _id: req.params.id, collaborators: req.user.id });
      if (!sharedProject) return res.status(404).json({ msg: 'Project not found' });
      return res.json(sharedProject);
    }
    res.json(project);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Create project
router.post('/projects', auth, async (req, res) => {
  try {
    const project = new Project({ ...req.body, userId: req.user.id });
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update project (owner only for core fields)
router.put('/projects/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update project design (owner only)
router.put('/projects/:id/design', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { design: req.body },
      { new: true }
    );
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete project
router.delete('/projects/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    res.json({ msg: 'Project deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Add collaborator to project (owner only)
router.post('/projects/:id/collaborators', auth, async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ msg: 'userId is required' });
    const project = await Project.findOne({ _id: req.params.id, userId: req.user.id });
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    if (!Array.isArray(project.collaborators)) project.collaborators = [];
    if (!project.collaborators.find((id) => String(id) === String(userId))) {
      project.collaborators.push(userId);
      await project.save();
    }
    res.json(project);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Remove collaborator from project (owner only)
router.delete('/projects/:id/collaborators/:collabUserId', auth, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user.id });
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    project.collaborators = (project.collaborators || []).filter(
      (uid) => String(uid) !== String(req.params.collabUserId)
    );
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// ============= FAVORITE ROUTES =============

// Get user's favorites
router.get('/favorites', auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.id });
    res.json(favorites);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Create favorite
router.post('/favorites', auth, async (req, res) => {
  try {
    const favorite = new Favorite({ ...req.body, userId: req.user.id });
    await favorite.save();
    res.json(favorite);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete favorite
router.delete('/favorites/:id', auth, async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!favorite) return res.status(404).json({ msg: 'Favorite not found' });
    res.json({ msg: 'Favorite deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Toggle favorite directly from projects/files
router.post('/favorites/toggle', auth, async (req, res) => {
  try {
    const { itemId, type, favorite } = req.body || {};
    if (!itemId || !type) {
      return res.status(400).json({ msg: 'itemId and type are required' });
    }

    const normalizedType = String(type).toLowerCase();
    const resolveFavorite = (currentValue) =>
      typeof favorite === 'boolean' ? favorite : !currentValue;

    if (normalizedType === 'project') {
      const project = await Project.findOne({ _id: itemId, userId: req.user.id });
      if (!project) {
        return res.status(404).json({ msg: 'Project not found' });
      }
      project.favorite = resolveFavorite(project.favorite);
      await project.save();
      return res.json({ type: 'project', item: project });
    }

    if (normalizedType === 'file') {
      const file = await UserFile.findOne({ _id: itemId, user: req.user.id });
      if (!file) {
        return res.status(404).json({ msg: 'File not found' });
      }
      file.favorite = resolveFavorite(file.favorite);
      await file.save();
      return res.json({ type: 'file', item: file });
    }

    return res.status(400).json({ msg: 'Unsupported favorite type' });
  } catch (err) {
    console.error('Favorite toggle error:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// ============= BRAND KIT ROUTES =============

// Get user's brand kits (own + shared as collaborator)
router.get('/brandkits', auth, async (req, res) => {
  try {
    const [own, shared] = await Promise.all([
      BrandKit.find({ userId: req.user.id }),
      BrandKit.find({ collaborators: req.user.id }).populate('userId', 'firstName lastName email')
    ]);

    // Mark shared kits and add owner info
    const ownKits = own.map(kit => ({ ...kit.toObject(), isShared: false, sharedBy: null }));
    const sharedKits = shared.map(kit => {
      const kitObj = kit.toObject();
      const owner = kit.userId;
      const ownerName = owner ? `${owner.firstName || ''} ${owner.lastName || ''}`.trim() || owner.email : 'Unknown';
      return {
        ...kitObj,
        isShared: true,
        sharedBy: {
          id: owner._id,
          name: ownerName,
          email: owner.email
        }
      };
    });

    const brandKits = [...ownKits, ...sharedKits].sort((a, b) => b.createdAt - a.createdAt);
    res.json(brandKits);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Create brand kit
router.post('/brandkits', auth, async (req, res) => {
  try {
    const { name, tagline, primaryColor, secondaryColor, logoUrl } = req.body;
    if (!name) return res.status(400).json({ msg: 'Name is required' });
    const brandKit = new BrandKit({
      userId: req.user.id,
      name,
      tagline: tagline || '',
      primaryColor: primaryColor || '',
      secondaryColor: secondaryColor || '',
      logoUrl: logoUrl || '',
    });
    await brandKit.save();
    res.json(brandKit);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update brand kit
router.put('/brandkits/:id', auth, async (req, res) => {
  try {
    const brandKit = await BrandKit.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!brandKit) return res.status(404).json({ msg: 'Brand kit not found' });
    res.json(brandKit);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Add collaborator to brand kit (owner only)
router.post('/brandkits/:id/collaborators', auth, async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ msg: 'userId is required' });
    const kit = await BrandKit.findOne({ _id: req.params.id, userId: req.user.id });
    if (!kit) return res.status(404).json({ msg: 'Brand kit not found' });
    if (!Array.isArray(kit.collaborators)) kit.collaborators = [];

    // Check if already a collaborator
    if (kit.collaborators.find((id) => String(id) === String(userId))) {
      return res.json(kit);
    }

    kit.collaborators.push(userId);
    await kit.save();

    // Send email notification to the new collaborator
    try {
      const collaborator = await User.findById(userId);
      if (collaborator && collaborator.email) {
        const owner = await User.findById(req.user.id);
        const ownerName = owner ? `${owner.firstName || ''} ${owner.lastName || ''}`.trim() || owner.email : 'Team Owner';

        await sendBrandKitShareEmail(
          collaborator.email,
          kit.name,
          ownerName
        );
        console.log(`Brand kit share email sent to ${collaborator.email}`);
      }
    } catch (emailError) {
      console.error('Error sending brand kit share email:', emailError);
      // Don't fail the request if email fails, just log it
    }

    res.json(kit);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Remove collaborator from brand kit (owner only)
router.delete('/brandkits/:id/collaborators/:collabUserId', auth, async (req, res) => {
  try {
    const kit = await BrandKit.findOne({ _id: req.params.id, userId: req.user.id });
    if (!kit) return res.status(404).json({ msg: 'Brand kit not found' });
    kit.collaborators = (kit.collaborators || []).filter(
      (uid) => String(uid) !== String(req.params.collabUserId)
    );
    await kit.save();
    res.json(kit);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Helper function to delete S3 folder and all its contents
async function deleteS3Folder(userId, kitFolder) {
  try {
    const Bucket = process.env.AWS_S3_BUCKET;
    if (!Bucket) {
      throw new Error('AWS_S3_BUCKET not configured');
    }

    const Prefix = `${userId}/brandkit/${kitFolder}/`;

    // List all objects in the folder
    let ContinuationToken = undefined;
    const objectsToDelete = [];

    do {
      const resp = await s3
        .listObjectsV2({ Bucket, Prefix, ContinuationToken })
        .promise();

      if (resp.Contents && resp.Contents.length > 0) {
        resp.Contents.forEach((obj) => {
          objectsToDelete.push({ Key: obj.Key });
        });
      }

      ContinuationToken = resp.IsTruncated ? resp.NextContinuationToken : undefined;
    } while (ContinuationToken);

    // Delete all objects
    if (objectsToDelete.length > 0) {
      await s3
        .deleteObjects({
          Bucket,
          Delete: {
            Objects: objectsToDelete,
            Quiet: false,
          },
        })
        .promise();
    }

    return true;
  } catch (error) {
    console.error('Error deleting S3 folder:', error);
    throw error;
  }
}

// Delete brand kit
router.delete('/brandkits/:id', auth, async (req, res) => {
  try {
    // Find the brandkit first to get its name for S3 folder matching
    const brandKit = await BrandKit.findOne({ _id: req.params.id, userId: req.user.id });
    if (!brandKit) {
      return res.status(404).json({ msg: 'Brand kit not found' });
    }

    const userId = req.user.id;
    const Bucket = process.env.AWS_S3_BUCKET;

    // Search for S3 folders matching this brandkit
    // KitFolder format: name.toLowerCase().replace(/ /g, "-") + "-" + Date.now()
    const normalizedName = brandKit.name.toLowerCase().replace(/ /g, '-');
    const Prefix = `${userId}/brandkit/`;

    let ContinuationToken = undefined;
    const foldersToDelete = new Set();

    // List all brandkit folders for this user
    do {
      const resp = await s3
        .listObjectsV2({ Bucket, Prefix, ContinuationToken, Delimiter: '/' })
        .promise();

      // Check common prefixes (folders)
      if (resp.CommonPrefixes) {
        resp.CommonPrefixes.forEach((prefix) => {
          const folderPath = prefix.Prefix;
          const folderName = folderPath.replace(Prefix, '').replace('/', '');
          // Match folders that start with the normalized brand name
          if (folderName.startsWith(normalizedName + '-')) {
            foldersToDelete.add(folderName);
          }
        });
      }

      ContinuationToken = resp.IsTruncated ? resp.NextContinuationToken : undefined;
    } while (ContinuationToken);

    // Delete all matching S3 folders
    for (const folderName of foldersToDelete) {
      try {
        await deleteS3Folder(userId, folderName);
      } catch (s3Error) {
        console.error(`Error deleting S3 folder ${folderName}:`, s3Error);
        // Continue with database deletion even if S3 deletion fails
      }
    }

    // Delete from database
    await BrandKit.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    res.json({ msg: 'Brand kit deleted successfully' });
  } catch (err) {
    console.error('Delete brand kit error:', err);
    res.status(500).json({ error: 'Server Error', msg: err.message });
  }
});

module.exports = router;

