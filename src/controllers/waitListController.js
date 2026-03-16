import WaitList from "../model/waitList.js";
export const waitListController = {
  waitlist: async (req, res) => {
    let position=42
    try {
      const { email, role } = req.body;
      console.log(req.body)
      if (!email || !role) throw new Error("all fields are required");
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) throw new Error("invalid email");
      const exist = await WaitList.findOne({ email });
      if (exist){
        return res.status(200).json({ message: "success",exist });
      }

      const roleMap = {
        provider: "buyer",
        trainer: "annotator",
      };
      const userRole = roleMap[role];
      if (!userRole) throw new Error("invalid role");
      const count = await WaitList.countDocuments()+position;
      const waiter = await WaitList.create({ email, role: userRole, position: count + 1, exists: true});
      return res.status(200).json({ message: "success",waiter });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },
 system_stats: async (req, res) => {
    try {
      const waiter = await WaitList.find();
      const count = await WaitList.countDocuments()+42;

      return res.status(200).json({ message: "success", waiter, count });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },
};
